<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        remote
        clearable
        :default-first-option="true"
        placeholder="请输入线路名称"
        :remote-method="queryLine"
        :disabled="isDisabled"
        >
        <el-option
            v-for="item in lineList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            @click.native="clickItem(item)"
            >
        </el-option>
    </el-select>
</template>

<script>
    import {Http} from 'src/global/http';
    import {Api} from 'src/global/api';
    export default {
        props: {
            value: String,
            auditStatus: String,
            isTmp: String,
            isDisabled:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                lineList: []
            }
        },
        computed:{
            currentValue: {
                // 动态计算currentValue的值
                get:function() {
                    return this.value; // 将props中的value赋值给currentValue
                },
                set:function(val) {
                    this.$emit('input', val); // 通过$emit触发父组件
                }
            }
        },
        mounted() {
            this.queryLine()
        },
        methods:{
            queryLine(query) {
                let vm = this;
                vm.lineList = [];
                Http.get(Api.line.commonSelect, {params: {'query': query,'isTmp':vm.isTmp,'auditStatus':vm.auditStatus}}, result => {
                    vm.lineList = result.result;
                })
            },
            setCurrentLine(line){
                if(line){
                    let vm  = this;
                    vm.lineList = [];
                    vm.lineList.push(line);
                }
            },
            clickItem(item){
                this.$emit('lineClick',item)
            }
        }
    }
</script>
