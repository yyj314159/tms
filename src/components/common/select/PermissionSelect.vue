<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        remote
        reserve-keyword
        clearable
        placeholder="请输入关键词"
        @change="onChange"
        :remote-method="queryPermission">
        <el-option
            v-for="item in permissionList"
            :key="item.code"
            :label="item.name"
            :value="item.code">
        </el-option>
    </el-select>
</template>

<script>
    import {Http,Api,Common,Constant} from 'src/global';
    export default {
        props: {
            value: String,
            level: String,
            auditStatus: String,
            change: Function
        },
        data() {
            return {
                permissionList: []
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
            queryPermission(query) {
                let vm = this;
                this.permissionList = [];
                Http.get(Api.permission.querySelect, {params: {'query': query}}, result => {
                    vm.permissionList = result.result;
                })
            },
            setCurrentCustomer(customer){
                if(customer){
                    let vm  = this;
                    vm.permissionList = [];
                    vm.permissionList.push(customer);
                }
            },
            onChange:function (value) {
                let vm = this;
                if(vm.change){
                    vm.change(value);
                }
            }
        }
    }
</script>

