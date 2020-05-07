<template>
    <el-select v-model="currentValue"
               remote
               clearable
               filterable
               default-first-option
               placeholder="请输入关键词"
               :remote-method="querySettlementCustomer" size="small">
        <el-option
            v-for="item in settlementCustomerList"
            :key="item.name"
            :label="item.name"
            :value="item.name">
            <span style="float: left">{{ item.name }}</span>
            <!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item.customerCode }}</span>-->
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
                settlementCustomerList: []
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
            querySettlementCustomer(query) {
                let vm = this;
                vm.settlementCustomerList = [];
                Http.get(Api.SettlementCustomer.getSettlementCustomerList, {params: {'query': query}}, result => {
                    vm.settlementCustomerList = result.result;
                })
            },
            setCurrentSettlementCustomer(settlementCustomer){
                if(settlementCustomer){
                    let vm  = this;
                    vm.settlementCustomerList = [];
                    vm.settlementCustomerList.push(settlementCustomer);
                }
            }
        }
    }
</script>
