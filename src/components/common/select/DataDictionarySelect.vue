<template>
    <el-select
        v-model="currentValue"
        clearable
        :filterable="filterable"
        size="small"
        :automatic-dropdown="true"
        @change="handleChange"
        :disabled="disabled"
        :placeholder="placeholder"
        :clearable="clearable">
        <el-option
            v-for="item in options"
            :key="item.code"
            :label="item.name"
            :value="item.code">
        </el-option>
    </el-select>
</template>

<script>

    import DataDictionary from 'src/components/common/data/data.js'

    export default {
        props: {
            value: [String,Boolean],
            optionName: { //数据字典父选项选项的编号
                type: String,
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: true
            },
            placeholder: {
                type: String,
                default: '请选择'
            },
            change: Function,
            excludeOptions: Array,   //要排除的选项 用逗号隔开
            filterable: {
                type:Boolean,
                default: false
            }
        },
        data() {
            return {
                //options : [],
            }
        },
        computed: {
            currentValue: {
                // 动态计算currentValue的值
                get: function () {
                    return this.value; // 将props中的value赋值给currentValue
                },
                set: function (val) {
                    this.$emit('input', val); // 通过$emit触发父组件
                }
            },
            options: {
                get: function () {
                    let vm = this;
                    let options = _.cloneDeep(DataDictionary[this.optionName]);
                    let newOptions = options;
                    if (newOptions && vm.excludeOptions) {
                        for (let j = 0; j < vm.excludeOptions.length; j++) {
                            for (let i = 0; i < newOptions.length; i++) {
                                if (newOptions[i].code == vm.excludeOptions[j]) {
                                    newOptions.splice(i, 1);
                                }
                            }
                        }
                    }
                    return newOptions;
                }
            }
        },
        mounted() {
            //this.init();
        },
        methods: {
            init() {
                let vm = this;
                let options = _.cloneDeep(DataDictionary[this.optionName]);
                vm.options = options;
                if (vm.options && vm.excludeOptions) {
                    for (let j = 0; j < vm.excludeOptions.length; j++) {
                        for (let i = 0; i < vm.options.length; i++) {
                            if (vm.options[i].code == vm.excludeOptions[j]) {
                                vm.options.splice(i, 1);
                            }
                        }
                    }
                }
            },
            handleChange: function (value) {
                var vm = this;
                if (vm.change) {
                    vm.change(value);
                }
                vm.$emit('change',value)
            }
        }
    }
</script>
