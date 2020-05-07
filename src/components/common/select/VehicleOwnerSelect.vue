<template>
    <el-select v-model="currentValue" remote
               clearable
               filterable
               default-first-option
               placeholder="请输入关键词"
               @change="handleChange"
               :remote-method="queryVehicleOwner" size="small" :disabled="disabled">
        <el-option
            v-for="item in vehicleOwnerList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            <span style="float: left">{{ item.name }}</span>
            <span style="margin-left: 10px">{{ item.idCardNo }}</span>
            <span style="margin-left: 10px">{{ item.mobile }}</span>
        </el-option>
    </el-select>
</template>

<script>
    import {Http} from 'src/global/http';
    import {Api} from 'src/global/api';
    export default {
        props: {
            value:String,
            showName:{
                type:Boolean,
                default:false
            },
            showMobile:{
                type:Boolean,
                default:false
            },
            disabled:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                vehicleOwnerList: []
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
        mounted(){
            // this.queryVehicleOwner()
        },
        methods:{
            queryVehicleOwner(query) {
                let vm = this;
                vm.vehicleOwnerList = [];
                Http.get(Api.vehicleOwner.commonSelect, {params: {'query': query}}, result => {
                    vm.vehicleOwnerList = result.result;
                })
            },
            setCurrentVehicleOwner(vehicleOwner){
                if(vehicleOwner){
                    let vm  = this;
                    vm.vehicleOwnerList = [];
                    vm.vehicleOwnerList.push(vehicleOwner);
                }
            },
            handleChange(val){
                let vm  = this;
                let driverObj = null;
                vm.vehicleOwnerList.forEach(item => {
                    if(item.id==val){
                        driverObj = item;
                    }
                });
                vm.$emit('driver',driverObj);
            },
        }
    }
</script>
