<template>
    <el-select v-model="currentValue" size="small" filterable :disabled="disabled" style="display: block;width: 100%;" :multiple="multiple" :placeholder="placeholder"
               default-first-option remote :reserve-keyword="false" clearable :remote-method="getOrgList" @change="handleChange">
        <el-option v-for="item in orgList" :value="item.code" :label="item.name" :key="item.code">
            <span style="float: left">{{item.name}}</span>
        </el-option>
    </el-select>
</template>

<script>
    import {Http,Api} from 'src/global/index';

    export default {
        props: {
            value: [ String, Array ],
            disabled: {
                type: Boolean,
                default: false
            },
            multiple: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: '请选择'
            }
        },
        data() {
            return { orgList: [] }
        },
        computed: {
            currentValue: {
                get() { return this.value },
                set(val) { this.$emit('input', val) }
            }
        },
        mounted() { this.getOrgList() },
        methods: {
            getOrgList(val) {
                Http.get(Api.org.commonSelect, {params: {'query': val}}, result => {
                    this.orgList = result.result;
                })
            },
            setOrgList(obj){
                this.orgList = Array.isArray(obj) ? obj : [obj]
            },
            handleChange(val){
                if(this.multiple){
                    this.$emit('change',this.orgList.filter(item => val.includes(item.code)))
                }else{
                    this.$emit('change',this.orgList.filter(item => item.code === val)[0])
                }
            }
        }
    }
</script>
