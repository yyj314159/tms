<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        :disabled="disabled"
        remote
        clearable
        :placeholder="placeholder"
        :remote-method="queryAuditApprovers"
        @change="handleChange">
        <el-option
            v-for="item in auditApproversList"
            :key="item.username"
            :label="item.name"
            :value="item.username">
            <span style="float: left">{{item.name}}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{item.username}}</span>
        </el-option>
    </el-select>
</template>

<script>
    import {Http,Api} from 'src/global';

    export default {
        props: {
            value:String,
            disabled:{
                type:Boolean,
                default:false
            },
            placeholder:String
        },
        data() {
            return {
                auditApproversList: []
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
            this.queryAuditApprovers()
        },
        methods:{
            queryAuditApprovers(query) {
                let vm = this;
                vm.auditApproversList = [];
                Http.get(Api.auditProcess.auditApproversSelect, {params: {'query': query}}, result => {
                    vm.auditApproversList = result.result;
                })
            },
            setCurrentAuditApprovers(auditApprovers){
                if(auditApprovers){
                    let vm  = this;
                    vm.auditApproversList = [];
                    vm.auditApproversList.push(auditApprovers);
                }
            },
            handleChange(val){
                let vm  = this;
                let user = null;
                vm.auditApproversList.forEach(item => {
                    if(item.username===val){
                        user = item;
                    }
                });
                vm.$emit('change-option',user);
            }
        }
    }
</script>
