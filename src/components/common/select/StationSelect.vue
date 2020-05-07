<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        remote
        clearable
        :default-first-option="true"
        placeholder="请输入关键词"
        @change="handleChange"
        :remote-method="queryStation">
        <el-option
            v-for="item in stationList"
            :key="item.code"
            :label="item.name"
            :value="item.code">
        </el-option>
    </el-select>
</template>

<script>
    import {Http} from 'src/global/http';
    import {Api} from 'src/global/api';
    export default {
        props: {
            value: String,
            customerCode: String,
            auditStatus: String
        },
        data() {
            return {
                stationList: [],
                stationName: ''
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
            queryStation(query) {
                let vm = this;
                vm.stationList = [];
                Http.get(Api.station.commonSelect, {params: {'query': query, 'customerCode': vm.customerCode, 'auditStatus': vm.auditStatus}}, result => {
                    vm.stationList = result.result;
                })
            },
            setCurrentStation(station){
                if(station){
                    let vm  = this;
                    vm.stationList = [];
                    vm.stationList.push(station);
                }
            },
            handleChange(val){
                let vm  = this;
                vm.stationList.forEach(item => {
                    if(item.code==val){
                        this.$emit('update:stationName',item.name);
                        this.$emit('change',item);
                    }
                });
            },
            clearStationList() {
                this.stationList = [];
            }
        }
    }
</script>
