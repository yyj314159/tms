<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        remote
        reserve-keyword
        default-first-option
        clearable
        placeholder="请输入关键词"
        @change="onChange"
        :remote-method="queryEtc">
        <el-option
            v-for="item in etcList"
            :key="item.cardCode"
            :label="item.cardCode"
            :value="item.cardCode">
            <span style="float: left">{{ item.cardCode }}</span>
        </el-option>
    </el-select>
</template>

<script>
    import {Http} from 'src/global/http';
    import {Api} from 'src/global/api';
    export default {
        props: {
            value: String,
            level: String,
            auditStatus: String,
            change: Function
        },
        data() {
            return {
                etcList: []
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
        methods:{
            queryEtc(query) {
                let vm = this;
                this.etcList = [];
                Http.get(Api.etcManager.commonSelect, {params: {'query': query}}, result => {
                    vm.etcList = result.result;
                })
            },
            setCurrentCustomer(customer){
                if(customer){
                    let vm  = this;
                    vm.etcList = [];
                    vm.etcList.push(customer);
                }
            },
            onChange:function (value) {
                var vm = this;
                if(vm.change){
                    vm.change(value);
                }
            }
        }
    }
</script>

