<template>
    <el-dialog title="线路信息" :visible.sync="visible" width="50%" @close="close">
        <el-form :model="lineForm" size="small" label-width="165px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="线路名称:">
                        {{lineForm.dispatchLine.lineName}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="出发站点:">
                        {{lineForm.dispatchLine.startStation?lineForm.dispatchLine.startStation.name:''}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="目的站点:">
                        {{lineForm.dispatchLine.endStation?lineForm.dispatchLine.endStation.name:''}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="客户名称:">
                        {{lineForm.customer?lineForm.customer.name:""}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="线路类型:">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="LINE_TYPE" :value="lineForm.dispatchLine.lineType"></dictionary-select-name>
                        </template>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="营运类型:">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="LINE_OPERATION_TYPE" :value="lineForm.dispatchLine.operationType"></dictionary-select-name>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出发城市:">
                        {{lineForm.dispatchLine.startStation.city.name}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="经停城市:">
                        {{lineForm.dispatchLine.stopOverCityName}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="目的城市:">
                        {{lineForm.dispatchLine.endStation.city.name}}
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            currentRow:{
                type: Object,
                default: null
            }
        },
        data() {
            return {
                visible: true,
                lineForm: {
                    dispatchLine: {
                        startStation:{
                            city:{}
                        },
                        endStation:{
                            city:{}
                        }
                    },
                    customer: {}
                }
            }
        },
        watch:{
            //监听传入的visible参数
            dialogVisible(val){
                if(val){
                    this.visible = val;
                }
            }
        },
        created() {
            this.init(this.currentRow);
        },
        methods: {
            close() {
                this.visible = false;
                this.$emit('close');
            },
            init(row){
                let vm = this;
                vm.lineForm = row;
            }
        }
    }
</script>
<style scoped>
    .blue{
        color:#20a0ff;
        display: inline-block;
        width:150px;
        margin-bottom: 12px;
    }
</style>
