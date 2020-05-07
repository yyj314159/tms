<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        :disabled="disabled"
        :allow-create="isAllow"
        remote
        clearable
        default-first-option
        placeholder="请输入手机号或司机姓名"
        :remote-method="queryDriver"
        @change="handleChange">
        <el-option
            v-for="item in driverList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            <span style="float: left" >{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px" >{{ item.mobile? item.mobile:"" }}</span>
        </el-option>
    </el-select>
</template>

<script>
    import {Http,Api} from 'src/global';
    export default {
        props: {
            value:String,
            orgCode:String,
            isAllow:{
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                driverList: []
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
            },
        },
        mounted(){
            //this.queryDriver()
        },
        methods:{
            queryDriver(query) {
                let vm = this;
                vm.driverList = [];
                Http.get(Api.driver.commonSelect, {params: {'query': query, 'orgCode': vm.orgCode}}, result => {
                    vm.driverList = result.result;
                    if(query && vm.isAllow){
                        vm.driverList.unshift({'id':query,'name':query});
                    }
                })
            },
            setCurrentDriver(driver){
                let vm  = this;
                vm.driverList = [];
                if(Array.isArray(driver)){
                    vm.driverList = driver;
                }else{
                    vm.driverList.push(driver);
                }
            },
            handleChange(val){
                let vm  = this;
                let driverObj = null;
                vm.driverList.forEach(item => {
                    if(item.id===val){
                        driverObj = item;
                    }
                });
                vm.$emit('driver',driverObj);
            },
            clearDriverList(){
                let vm  = this;
                vm.driverList = [];
            }
        }
    }
</script>
