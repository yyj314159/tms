<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        :disabled="disabled"
        remote
        clearable
        placeholder="请输入关键词"
        :remote-method="queryOrg"
        @change="handleChange">
        <el-option
            v-for="item in orgList"
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
            value:String,
            nature: {       // 组织性质(总部 HEADQUARTERS，大区 AREA，分区 PARTITION 等,多个用逗号隔开)
                type: String
            },
            disabled:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                orgList: []
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
            this.queryOrg()
        },
        methods:{
            queryOrg(query) {
                let vm = this;
                vm.orgList = [];
                Http.get(Api.org.commonSelect, {params: {'query': query, 'nature': this.nature}}, result => {
                    vm.orgList = result.result;
                })
            },
            setCurrentOrg(org){
                if(org){
                    let vm  = this;
                    vm.orgList = [];
                    vm.orgList.push(org);
                }
            },
            handleChange(val){
                this.$emit('change',val)
            }
        }
    }
</script>
