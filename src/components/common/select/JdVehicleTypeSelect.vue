<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        :disabled="disabled"
        remote
        clearable
        placeholder="请输入关键词"
        :remote-method="queryType">
        <el-option
            v-for="item in jdTypeList"
            :key="item.code"
            :label="item.name"
            :value="item.code">
        </el-option>
    </el-select>
</template>

<script>
    import {Http,Api} from 'src/global';

    export default {
        props: {
            value:'',
            disabled:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                jdTypeList: []
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
            this.queryType()
        },
        methods:{
            queryType(query) {
                let vm = this;
                vm.jdTypeList = [];
                Http.get(Api.jdOrder.commonSelect, {params: {'query': query}}, result => {
                    vm.jdTypeList = result.result;
                })
            },
            setCurrentJdVehicleType(jdVehicleType){
                if(jdVehicleType){
                    let vm  = this;
                    vm.jdTypeList = [];
                    vm.jdTypeList.push(jdVehicleType);
                }
            }
        }
    }
</script>
