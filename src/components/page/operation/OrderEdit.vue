<template>
    <el-dialog :title="title" :visible.sync="visible" width="90%" :top="marginTop" @close="close">
        <el-form size="small" :model="orderForm" ref="orderForm" label-width="120px" :rules="rules">
            <span class="blue">线路信息</span>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="线路名称:" prop="lineId">
                        <line-select v-model="orderForm.lineId" style="display:block" @lineClick="lineClick"
                                     ref="lineDom" :isDisabled="showType||type == 'edit'"></line-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="客户名称:" prop="customerCode">
                        <customer-select v-model="orderForm.customerCode" style="display:block" ref="customerDom"
                                         isDisabled></customer-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="始发区域:" prop="startCityArr">
                        <district-select v-model="orderForm.startCityArr" style="display:block"
                                         isDisabled></district-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="目的区域:" prop="endCityArr">
                        <district-select v-model="orderForm.endCityArr" style="display:block"
                                         isDisabled></district-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="线路里程:" prop="dispatch.dispatchLine.distance">
                        <el-input v-model="orderForm.dispatch.dispatchLine.distance" disabled>
                            <template slot="append">公里</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="则一时效:">
                        <el-input v-model="orderForm.dispatch.dispatchLine.timeConsumeZeyiHour" disabled>
                            <template slot="append">小时</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item label-width="0">
                        <el-input v-model="orderForm.dispatch.dispatchLine.timeConsumeZeyiMin" disabled>
                            <template slot="append">分钟</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="预计发车时间:" prop="expectDepartureTime">
                        <el-date-picker
                            @change="changeDepartureTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="orderForm.expectDepartureTime"
                            type="datetime"
                            :placeholder="showType?'':'选择日期时间'"
                            :disabled="showType" style="width:100%;"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="预计到达时间:" prop="expectArrivalTime">
                        <el-date-picker
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="orderForm.expectArrivalTime"
                            type="datetime"
                            :placeholder="showType?'':'选择日期时间'"
                            :disabled="showType || type == 'edit'" style="width:100%;"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"><span class="blue">车辆信息</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="车型:" prop="vehicleLength">
                        <dictionary-select
                            style="display:block;" v-model="orderForm.vehicleLength"
                            option-name="VEHICLE_SPECIFICATION" :disabled="showType || type == 'edit'"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="厢型:" prop="vanType">
                        <dictionary-select
                            v-model="orderForm.vanType" style="display:block;"
                            option-name="VEHICLE_COMPARTMENT_TYPE" :disabled="showType || type == 'edit'"></dictionary-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"><span class="blue">应付信息</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="参考车价:" prop="paidVehicleAmount">
                        <el-input v-model="orderForm.paidVehicleAmount" :disabled="showType"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="预付款:" prop="prepaidCardAmount" :rules="[validate.money]">
                        <el-input v-model="orderForm.prepaidCardAmount" :disabled="showType"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="货到款:" prop="deliveryAmount" :rules="[validate.money]">
                        <el-input v-model="orderForm.deliveryAmount" :disabled="showType"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="油卡金额:" prop="dispatch.dispatchPrice.oilCardAmount" :rules="[validate.money]">
                        <el-input v-model="orderForm.oilCardAmount" :disabled="showType"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"><span class="blue">抢单信息</span></el-col>
            </el-row>
            <!-- <el-row>
               <el-col :span="12">
                    <el-form-item label="抢单开始时间：" label-width="150" prop="grabStartTime">
                        <el-date-picker
                           value-format="yyyy-MM-dd HH:mm:ss"
                           v-model="orderForm.grabStartTime"
                           type="datetime"
                           placeholder="选择日期时间" :disabled="showType">
                       </el-date-picker>
                   </el-form-item>
               </el-col>
               <el-col :span="12">
                    <el-form-item label="抢单结束时间：" label-width="150" prop="grabEndTime">
                        <el-date-picker
                           value-format="yyyy-MM-dd HH:mm:ss"
                           v-model="orderForm.grabEndTime"
                           type="datetime"
                           placeholder="选择日期时间" :disabled="showType">
                       </el-date-picker>
                   </el-form-item>
               </el-col>
           </el-row> -->
            <el-row>
                <el-col :span="18">
                    <el-form-item label="备注信息：">
                        <el-input type="textarea" :rows="1" :maxlength="200" :placeholder="showType?'':'最多200个字符！'"
                                  v-model="orderForm.remark" :disabled="showType"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2" v-if="false">
                    <el-form-item label="客户订单号:" prop="customerOrderCode">
                        <el-input v-model="orderForm.customerOrderCode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2" v-if="false">
                    <el-form-item label="德邦订单标识:" prop="dpTruckId">
                        <el-input v-model="orderForm.dpTruckId"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2" v-if="false">
                    <el-form-item label="url:" prop="url">
                        <el-input v-model="orderForm.url"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="text-align: right" v-if="type != 'show'">
                    <el-button size="small" @click="close" style="margin-left: 30px;">取消</el-button>
                    <el-button :disabled="isSubmitBtnDisabled" type="primary" @click="submitOrderForm" size="small">确定
                    </el-button>
                </el-col>
            </el-row>
        </el-form>
        <line-select v-if="showLineSelect" :dialog-visible="showLineSelect" @close="hideLineSelect"></line-select>
    </el-dialog>
</template>

<script>
    import {Http, Api} from 'src/global'
    import {Constant} from 'src/global/constant'
    import {Validate} from 'src/global/validate'
    import {Common} from 'src/global/common'
    import constData from 'src/components/common/data/data.js'


    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: 'add'
            },
            url: {
                type: String,
                default: ''
            },
            order: {
                type: Boolean,
                default: false
            },
            currentRow: {
                type: Object
            }
        },
        data() {
            return {
                showType: this.type == 'show', // 是否仅展示
                visible: true,//本组件窗口的显示隐藏
                title: "新增订单： ",
                showLineSelect: false,
                validate: Validate,//校验
                constant: Constant,//常量
                common: Common,//公共方法
                dispatchVehicleCloneObj: null,
                dispatchPriceCloneObj: null,
                defaultSupplier: {id: "", name: ""},
                orderForm: {
                    startCityArr: [],
                    endCityArr: [],
                    customerCode: '',
                    expectDepartureTime: '',
                    expectArrivalTime: '',
                    paidVehicleAmount: '',
                    prepaidCardAmount: '',
                    deliveryAmount: '',
                    oilCardAmount: '',
                    dpTruckId:'',
                    url: '',
                    line: {},
                    dispatch: {
                        dispatchLine: {},
                        dispatchPrice: {},
                        dispatchVehicle: {}
                    }
                },
                detailLineInfoForm: {},
                isSubmitBtnDisabled: false, // 上传loading
                rules: {
                    lineId: [
                        {required: true, message: '请选择线路', trigger: 'blur'},
                    ],
                    vehicleLength: [
                        {required: true, message: '请选择车型', trigger: 'blur'},
                    ],
                    vanType: [
                        {required: true, message: '请选择厢型', trigger: 'blur'},
                    ],
                    grabStartTime: [
                        {required: true, message: '请输入抢单开始时间', trigger: 'blur'},
                    ],
                    grabEndTime: [
                        {required: true, message: '请选择抢单结束时间', trigger: 'blur'}
                    ],
                    expectDepartureTime: [
                        {required: true, message: '请选择预计发车时间', trigger: 'blur'}
                    ],
                    expectArrivalTime: [
                        {required: true, message: '请选择预计到达时间', trigger: 'blur'}
                    ],
                    paidVehicleAmount: [
                        {required: true, message: '请输入应付车价', trigger: 'blur'},
                        Validate.money
                    ],
                    /* 'dispatch.dispatchPrice.paidVehicleAmount':[
                         { required: true, message: '请输入应付车价', trigger: 'blur' }
                     ],*/
                }
            }
        },
        mounted() {
            this.dispatchVehicleCloneObj = _.cloneDeep(this.addVehicleForm.dispatchVehicle);
            this.dispatchPriceCloneObj = _.cloneDeep(this.addVehicleForm.dispatchPrice);
        },
        components: {},
        computed: {
            marginTop() { //根据不同屏幕高度设置弹框的位置
                if (document.documentElement.clientHeight > 900) {
                    return "15vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "8vh";
                }
            },
        },
        watch: {},
        mounted() {
            if (this.type == 'add' && !this.order) {
                this.title = "新增订单"
            } else if (this.type == 'add' && this.order) {
                this.title = "新增订单"
                this.orderForm = Object.assign({},this.orderForm,this.currentRow);
                if (!this.orderForm.expectDepartureTime) {
                    this.setDepartureTime()
                }
            } else if (this.type == 'edit') {
                this.title = "完善订单"
                this.orderForm = Object.assign({},this.orderForm,this.currentRow);
                let lineObj = {
                    id: this.currentRow.lineId,
                    name: this.currentRow.dispatch.dispatchLine.lineName
                }
                let dispatchLine = this.currentRow.dispatch.dispatchLine
                this.$nextTick(() => {
                    this.$refs.lineDom.setCurrentLine(lineObj)
                    this.$refs.customerDom.setCurrentCustomer(this.currentRow.customer)
                })
                this.orderForm.startCityArr = [dispatchLine.startStation.city.parentCode, dispatchLine.startStation.city.code]
                this.orderForm.endCityArr = [dispatchLine.endStation.city.parentCode, dispatchLine.endStation.city.code]
                this.detailLineInfoForm = dispatchLine
                if (!this.orderForm.expectDepartureTime) {
                    this.setDepartureTime()
                }
            } else if (this.type == 'show') {
                this.title = "订单详情"
                this.orderForm = this.currentRow
                let lineObj = {
                    id: this.currentRow.lineId,
                    name: this.currentRow.dispatch.dispatchLine.lineName
                }
                let dispatchLine = this.currentRow.dispatch.dispatchLine

                this.$nextTick(() => {
                    this.$refs.lineDom.setCurrentLine(lineObj)
                    this.$refs.customerDom.setCurrentCustomer(this.currentRow.customer)
                })
                this.orderForm.startCityArr = [dispatchLine.startStation.city.parentCode, dispatchLine.startStation.city.code]
                this.orderForm.endCityArr = [dispatchLine.endStation.city.parentCode, dispatchLine.endStation.city.code]
            }
        },
        methods: {
            changeDepartureTime() {
                if (!this.orderForm.lineId) return
                let departureTime = new Date(this.orderForm.expectDepartureTime).getTime()
                let huor = this.orderForm.dispatch.dispatchLine.timeConsumeZeyiHour ? this.orderForm.dispatch.dispatchLine.timeConsumeZeyiHour : 0
                let min = this.orderForm.dispatch.dispatchLine.timeConsumeZeyiMin ? this.orderForm.dispatch.dispatchLine.timeConsumeZeyiMin : 0
                this.orderForm.expectArrivalTime = Common.date.dateFormat(new Date((departureTime + (huor * 60 + min) * 60 * 1000)).getTime(), "YYYY-MM-DD HH:mm:ss")
            },
            lineClick(item) {
                this.orderForm.dispatch.dispatchLine.timeConsumeZeyiHour = item.timeZeyiHour
                this.orderForm.dispatch.dispatchLine.timeConsumeZeyiMin = item.timeZeyiMin
                this.orderForm.dispatch.dispatchLine.distance = item.distance
                this.getDetail(item)
            },
            getDetail(item) {
                let vm = this;
                Http.get(Api.line.queryDetailById, {params: {'id': item.id}}, result => {
                    vm.detailLineInfoForm = result.result;
                    vm.$refs.customerDom.setCurrentCustomer(result.result.customer);
                    vm.orderForm.startCityArr = [vm.detailLineInfoForm.departStation.city.parentCode, vm.detailLineInfoForm.departStation.city.code]
                    vm.orderForm.endCityArr = [vm.detailLineInfoForm.destStation.city.parentCode, vm.detailLineInfoForm.destStation.city.code]
                    this.$nextTick(() => {
                        vm.orderForm.customerCode = result.result.customerCode
                    })
                    this.setDepartureTime()
                })
            },
            setDepartureTime() {
                const oneDay = 1000 * 60 * 60 * 24
                if (this.detailLineInfoForm.departTime) {
                    let rankTime = this.getFormatTime(this.detailLineInfoForm.departTime)
                    if (rankTime > Date.now()) {
                        this.orderForm.expectDepartureTime = Common.date.dateFormat(rankTime, "YYYY-MM-DD HH:mm:ss")
                    } else {
                        this.orderForm.expectDepartureTime = Common.date.dateFormat(rankTime + oneDay, "YYYY-MM-DD HH:mm:ss")
                    }
                    this.changeDepartureTime()
                } else {
                    this.orderForm.expectDepartureTime = ''
                    this.orderForm.expectArrivalTime = ''
                }
            },
            getFormatTime(time) {
                let day = Common.date.dateFormat(new Date(), 'YYYY-MM-DD')
                return new Date(`${day} ${time}`).getTime()


            },
            submitOrderForm() {
                this.$refs.orderForm.validate((val) => {
                    if (val) {
                        if (this.getTimeStamp(this.orderForm.grabStartTime) >= this.getTimeStamp(this.orderForm.grabEndTime)) {
                            this.$message.error('抢单开始时间不能大于结束时间')
                            return
                        }
                        if (this.orderForm.expectDepartureTime && this.orderForm.expectArrivalTime) {
                            if (this.getTimeStamp(this.orderForm.expectDepartureTime) >= this.getTimeStamp(this.orderForm.expectArrivalTime)) {
                                this.$message.error('预计发车时间不能大于结束时间')
                                return
                            }
                        }
                        let otherAount = (this.orderForm.prepaidCardAmount ? parseFloat(this.orderForm.prepaidCardAmount) : 0)
                                            + (this.orderForm.deliveryAmount ? parseFloat(this.orderForm.deliveryAmount) : 0)
                                            + (this.orderForm.oilCardAmount ? parseFloat(this.orderForm.oilCardAmount) : 0)
                        console.log(otherAount);
                        if (parseFloat(this.orderForm.paidVehicleAmount) <  otherAount) {
                            this.$message.error('预付款 + 货到款 + 油卡金额的总和必须小于等于应付金额！')
                            return
                        }
                        let postData = this.orderForm
                        postData.dispatch.dispatchVehicle = {}
                        postData.dispatch.dispatchVehicle.vanType = this.orderForm.vanType
                        postData.dispatch.dispatchVehicle.vehicleLength = this.orderForm.vehicleLength
                        if (this.type == 'add') {
                            Http.post(this.url, postData, (res) => {
                                this.close()
                                this.$message.success('新建成功')
                            })
                        } else if (this.type == 'edit') {
                            Http.post(this.url, postData, (res) => {
                                this.close()
                                this.$message.success('完善成功')
                            })
                        }
                    }
                })
            },
            getTimeStamp(time) {
                return new Date(time).getTime()
            },
            //
            //关闭窗口
            close() {
                this.visible = false;
                this.$emit('close');
            },
        }
    }
</script>
<style scoped>
    .blue {
        color: #20a0ff;
        display: inline-block;
        margin-bottom: 12px;
    }
</style>
