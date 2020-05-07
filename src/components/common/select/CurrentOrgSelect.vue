<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        :default-first-option="true"
        :disabled="disabled"
        clearable
        @change="handleChange"
        placeholder="请输入关键词">
        <el-option
            v-for="item in userOrgList"
            :key="item.code"
            :label="item.name"
            :value="item.code">
        </el-option>
    </el-select>
</template>

<script>

    export default {
        props: {
            value: {},
            disabled:{
                type:Boolean,
                default:false
            },
            nature: {
                type:String //AREA 大区 PARTITION 分区 HEADQUARTERS 总部
            },
            natureList:Array,
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
            },
            userOrgList: {
                get:function () {
                    let vm = this;
                    let result = [];
                    let orgList = vm.$store.getters.orgList;
                    if(this.natureList && orgList && orgList.length > 0){
                        for(let j = 0; j < this.natureList.length; j++){
                            for (let i = 0; i < orgList.length; i++) {
                                if(orgList[i].nature == this.natureList[j]) {
                                    result.push(orgList[i]);
                                }
                            }
                        }
                    }else if (this.nature && orgList && orgList.length > 0) {
                        for (let i = 0; i < orgList.length; i++) {
                            if(orgList[i].nature == this.nature) {
                                result.push(orgList[i]);
                            }
                        }
                    } else {
                        result = orgList;
                    }
                    return result;
                }
            }
        },
        methods:{
            getOrgByCode(code) {
                let vm = this;
                let supplier = null;
                vm.userOrgList.forEach(item => {
                    if(item.code == code) {
                        supplier = item.parent.outsideSupplier;
                    }
                })
                return supplier;
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
