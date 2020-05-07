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
        :remote-method="queryGasStation">
        <el-option
            v-for="item in gasStationList"
            :key="item.name"
            :label="item.name"
            :value="item.id">
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
                gasStationList: []
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
            queryGasStation(query) {
                let vm = this;
                this.gasStationList = [];
                Http.get(Api.gasStation.commonSelect, {params: {'query': query}}, result => {
                    vm.gasStationList = result.result;
                })
            },
            setCurrentCustomer(customer){
                if(customer){
                    let vm  = this;
                    vm.gasStationList = [];
                    vm.gasStationList.push(customer);
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

