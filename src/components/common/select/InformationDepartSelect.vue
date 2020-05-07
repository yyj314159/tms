<template>
    <el-select v-model="currentValue" remote clearable filterable placeholder="请输入关键词"
               :remote-method="queryInformationDepart" size="small">
        <el-option
            v-for="item in informationDepartList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobile }}</span>
        </el-option>
    </el-select>
</template>

<script>
    import {Http} from 'src/global/http';
    import {Api} from 'src/global/api';
    export default {
        props: ['value'],
        data() {
            return {
                informationDepartList: []
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
            queryInformationDepart(query) {
                let vm = this;
                vm.informationDepartList = [];
                Http.get(Api.InformationDepart.getInformationDepartList, {params: {'query': query}}, result => {
                    vm.informationDepartList = result.result;
                })
            },
            setCurrentInformationDepart(informationDepart){
                let vm  = this;
                vm.informationDepartList = [];
                vm.informationDepartList.push(informationDepart);
            }
        }
    }
</script>
