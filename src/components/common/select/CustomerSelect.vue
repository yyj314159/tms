<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        remote
        :default-first-option="true"
        reserve-keyword
        clearable
        placeholder="请输入客户名称"
        @change="onChange"
        :remote-method="queryCustomer"
        :disabled="isDisabled"
        >
        <el-option
            v-for="item in customerList"
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
            level: String, //level="lowest" 底级客户 level="top" 顶级客户
            auditStatus: String,
            change: Function,
            changeLabel: Function, // 获取标签值
            isDisabled:{
                default:false
            }
        },
        data() {
            return {
                customerList: []
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
            queryCustomer(query) {
                let vm = this;
                this.customerList = [];
                Http.get(Api.customer.commonSelect, {params: {'query': query, 'level': vm.level, 'auditStatus': vm.auditStatus}}, result => {
                    vm.customerList = result.result;
                })
            },
            setCurrentCustomer(customer){
                if(customer){
                    let vm  = this;
                    vm.customerList = [];
                    vm.customerList.push(customer);
                }
            },
            onChange:function (value) {
                var vm = this;
                if(vm.change){
                    vm.change(value);
                }
                let obj = vm.customerList.find((item,index)=>{
                    return item.code == value;
                })
                vm.$emit('change',obj)
                vm.changeLabel&&vm.changeLabel(vm.getLabel(value))
            },
            getLabel(value){
                let obj = this.customerList.find((item) => {
                    return item.code === value
6               });
                return obj?obj.name:''
            }
        }
    }
</script>

