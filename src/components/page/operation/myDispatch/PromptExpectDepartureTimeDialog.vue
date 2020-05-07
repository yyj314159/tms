<template>
    <el-dialog title="确认预计发车时间" :visible.sync="Visible" width="90%" :top="marginTop" @close="close">
        <el-table size="small" class="content-table" :data="lineCollectForm" property="lineCollectForm" border fit highlight-current-row stripe>
            <el-table-column header-align="center" label="线路名称" prop="line.name" min-width="200">
            </el-table-column>
            <el-table-column header-align="center" label="预计发车时间" prop="expectDepartureTime" min-width="220">
                <template slot-scope="scope">
                    <el-date-picker
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="scope.row.expectDepartureTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        style="width:100%"
                        @change="changeExpectDepartureTime(scope.row)"
                    >
                    </el-date-picker>
                </template>
            </el-table-column>
            <el-table-column header-align="center" label="预计到达时间" prop="expectArrivalTime" min-width="220">
                <template slot-scope="scope">
                    <el-date-picker
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="scope.row.expectArrivalTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        style="width:100%"
                        :disabled=true
                    >
                    </el-date-picker>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="close">取 消</el-button>
                <el-button size="small" type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import axios from 'axios';
    import {Loading, Message} from 'element-ui';
    import {Http, Api} from 'src/global'
    import {Constant} from 'src/global/constant'
    import {Validate} from 'src/global/validate'
    import {Common} from 'src/global/common'

    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            lineCollectForm: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                Visible: false,
            }
        },
        created() {
            this.setDepartureTime();
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
            dialogVisible(val) {
                if (val) {
                    this.Visible = val;
                }
            },
            lineCollectForm() {
                this.setDepartureTime();
            },
        },
        methods: {
            close() {
                this.Visible = false;
                this.$emit('close');
            },
            setDepartureTime() {
                const oneDay = 1000 * 60 * 60 * 24
                if (this.lineCollectForm.length > 0) {
                    this.lineCollectForm.forEach((item, index) => {
                        if (item.line && item.line.departTime) {
                            let expectDepartureTime = '';
                            let rankTime = this.getFormatTime(item.line.departTime)
                            if (rankTime > Date.now()) {
                                expectDepartureTime = Common.date.dateFormat(rankTime, "YYYY-MM-DD HH:mm:ss")
                            } else {
                                expectDepartureTime = Common.date.dateFormat(rankTime + oneDay, "YYYY-MM-DD HH:mm:ss")
                            }
                            this.$set(item,'expectDepartureTime',expectDepartureTime);
                        } else {
                            this.$set(item,'expectDepartureTime','');
                            this.$set(item,'expectArrivalTime','');
                        }
                        this.changeExpectDepartureTime(item);
                    })
                }
            },
            getFormatTime(time) {
                let day = Common.date.dateFormat(new Date(), 'YYYY-MM-DD')
                return new Date(`${day} ${time}`).getTime()
            },
            changeExpectDepartureTime(item){
                let expectArrivalTime;
                if (item.expectDepartureTime){
                    expectArrivalTime =  Common.date.dateFormat(new Date(item.expectDepartureTime).getTime() + ((item.line ? (item.line.timeZeyiHour ? item.line.timeZeyiHour : 0) : 0) * 60 * 60 + (item.line ? (item.line.timeZeyiMin ? item.line.timeZeyiMin : 0) : 0) * 60) * 1000, "YYYY-MM-DD HH:mm:ss");
                }else {
                    expectArrivalTime = '';
                }
                this.$set(item,'expectArrivalTime',expectArrivalTime);
            },
            submit() {
                let vm = this;
                vm.newLineCollectForm = _.cloneDeep(vm.lineCollectForm).map((item, index) => {
                    let newItem = {};
                    newItem.lineId = item.lineId;
                    newItem.expectDepartureTime = item.expectDepartureTime;
                    newItem.expectArrivalTime = item.expectArrivalTime;
                    newItem.lineName = item.line.name;
                    return newItem;
                });
                let hasExpectDepartureTime = vm.newLineCollectForm.filter((item, index) => {
                    return !item.expectDepartureTime
                })
                if (hasExpectDepartureTime.length > 0) {
                    this.$message.error(`${hasExpectDepartureTime[0].lineName},预计发车时间为空,请检查!`)
                    return;
                }
                let expectArrivalTime = vm.newLineCollectForm.filter((item, index) => {
                    return !item.expectArrivalTime;
                })
                if (expectArrivalTime.length > 0) {
                    this.$message.error(`${expectArrivalTime[0].lineName}预计到达时间为空,请检查!`)
                    return;
                }
                let checkExpectDepartureTime = vm.newLineCollectForm.filter((item, index) => {
                    return new Date(item.expectDepartureTime).getTime() < new Date().getTime();
                })
                if (checkExpectDepartureTime.length > 0) {
                    this.$message.error(`${checkExpectDepartureTime[0].lineName}预计发车时间小于当前时间,请检查!`)
                    return;
                }
                let checkExpectArrivalTime = vm.newLineCollectForm.filter((item, index) => {
                    return new Date(item.expectArrivalTime).getTime() < new Date().getTime();
                })
                if (checkExpectArrivalTime.length > 0) {
                    this.$message.error(`${checkExpectArrivalTime[0].lineName}预计到达时间小于当前时间,请检查!`)
                    return;
                }
                let checkTwoTime = vm.newLineCollectForm.filter((item, index) => {
                    return new Date(item.expectDepartureTime).getTime() >= new Date(item.expectArrivalTime).getTime()
                })
                if (checkTwoTime.length > 0) {
                    this.$message.error(`${checkTwoTime[0].lineName}预计到达时间小于预计发车时间,请检查!`)
                    return;
                }
                let orderScheduleRequestDtoList = [];
                orderScheduleRequestDtoList = vm.newLineCollectForm.map((row,index) => {
                    let orderScheduleRequestDto = {}
                    orderScheduleRequestDto.lineId = row.lineId;
                    orderScheduleRequestDto.expectDepartureTime = row.expectDepartureTime
                    return orderScheduleRequestDto;
                });
                Http.post(Api.orderSchedule.getLineWithCreateDispatchBySchedule, orderScheduleRequestDtoList, function (res) {
                    if (res.result.length > 0) {
                        let content = '';
                        res.result.forEach(row => {
                            content += row.name + "，"
                        })
                        content += '已经存在预计发车时间同一日期由排班生成的派车单，确定生成派车单?'
                        vm.$confirm(content, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            Http.post(Api.lineCollect.handSelectLine, vm.newLineCollectForm, result => {
                                vm.$message.success('成功生成派车单！');
                                vm.close();
                            }, err => {
                                vm.$message.errors('生成派车单失败！');
                            })
                        })
                    }else {
                        Http.post(Api.lineCollect.handSelectLine, vm.newLineCollectForm, result => {
                            vm.$message.success('成功生成派车单！');
                            vm.close();
                        }, err => {
                            vm.$message.errors('生成派车单失败！');
                        })
                    }
                }, err => {
                    vm.close();
                })
            },

        }
    }
</script>
