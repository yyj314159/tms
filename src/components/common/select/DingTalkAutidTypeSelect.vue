<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        :disabled="disabled"
        remote
        clearable
        placeholder="请输入关键词"
        :remote-method="queryAuditType">
        <el-option
            v-for="item in auditTypeList"
            :key="item.auditType"
            :label="item.name"
            :value="item.auditType">
            <span style="float: left">{{item.name}}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{item.auditType}}</span>
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
            }
        },
        data() {
            return {
                auditTypeList: []
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
            this.queryAuditType()
        },
        methods:{
            queryAuditType(query) {
                let vm = this;
                vm.auditTypeList = [];
                Http.get(Api.auditProcess.auditTypeSelect, {params: {'query': query}}, result => {
                    vm.auditTypeList = result.result;
                })
            },
            setCurrentAuditType(auditType){
                if(auditType){
                    let vm  = this;
                    vm.auditTypeList = [];
                    vm.auditTypeList.push(auditType);
                }
            }
        }
    }
</script>
