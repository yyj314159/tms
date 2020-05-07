<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        remote
        clearable
        :default-first-option="true"
        placeholder="请输入关键词"
        :remote-method="queryRefuelingSupplier">
        <el-option
            v-for="item in refuelingSupplierList"
            :key="item.id"
            :label="item.oilsStationName"
            :value="item.id">
        </el-option>
    </el-select>
</template>

<script>
    import {Http} from 'src/global/http';
    import {Api} from 'src/global/api';
    export default {
        props: {
            value: String
        },
        data() {
            return {
                refuelingSupplierList: []
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
            this.queryRefuelingSupplier()
        },
        methods:{
            queryRefuelingSupplier(query) {
                let vm = this;
                vm.refuelingSupplierList = [];
                Http.get(Api.pushStationInfo.commonSelect, {params: {'query': query}}, result => {
                    vm.refuelingSupplierList = result.result;
                })
            },
            setCurrentRefuelingSupplier(refuelingSupplier){
                if(refuelingSupplier){
                    let vm  = this;
                    vm.refuelingSupplierList = [];
                    vm.refuelingSupplierList.push(refuelingSupplier);
                }
            }
        }
    }
</script>
