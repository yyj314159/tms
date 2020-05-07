<template>
    <el-select v-model="currentValue" size="small" automatic-dropdown @change="handleChange" :disabled="disabled" :placeholder="placeholder"
               :clearable="clearable" :filterable="filterable" :multiple="multiple" style="display: block;width: 100%;">
        <el-option v-for="item in options" :value="item.code" :label="item.name" :key="item.code">
        </el-option>
    </el-select>
</template>

<script>

    import DataDictionary from 'src/components/common/data/data.js'

    export default {
        props: {
            value: [String, Boolean, Array],
            optionName: { type: String, required: true },//数据字典对象编号
            excludeOptions:{ type: Array, default: ()=>[] },   //要排除的选项
            disabled: { type: Boolean, default: false },//禁用
            clearable: { type: Boolean, default: true },//清空
            filterable: { type: Boolean, default: false },//搜索
            multiple: { type: Boolean, default: false },//多选
            placeholder: {
                type: String,
                default: '请选择'
            }
        },
        computed: {
            currentValue: {
                get() { return this.value },
                set(val) { this.$emit('input', val) }
            },
            options() {
                return _.difference(_.cloneDeep(DataDictionary[this.optionName]), this.excludeOptions);
            }
        },
        methods: {
            handleChange(val) {
                if(this.multiple){
                    this.$emit('change',this.options.filter(item => val.includes(item.code)))
                }else{
                    this.$emit('change', val)
                }
            }
        }
    }
</script>
