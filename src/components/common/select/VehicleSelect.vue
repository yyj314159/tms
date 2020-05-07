<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        :disabled="disabledValue"
        :allow-create="isAllow"
        :default-first-option="true"
        remote
        reserve-keyword
        clearable
        :placeholder="placeholder"
        :remote-method="queryVehicle"
        @change="handleChange">
        <el-option
            v-for="item in vehicleList"
            :key="item.code"
            :label="item.licenseNumber"
            :value="item.code">
            <span style="float: left" >{{item.licenseNumber}}</span>
            <span style="float: left; margin-left: 23%" ><dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="item.operationMode"/></span>
            <span style="float: right; color: #8492a6; font-size: 13px" ><dictionary-select-name option-name="VEHICLE_STATUS" :value="item.status"/></span>
        </el-option>
    </el-select>
</template>

<script>

    import {Http, Api} from 'src/global';

    export default {
        props: {
            value:String,
            type:Array,//车辆类型
            settlementMode:String,//结算模式
            vehicleOperationType:String, //车辆营运类型
            orgCode:String,//区域
            placeholder:{
                type:String,
                default:'请输入车牌号'
            },
            isAllow:{
                type: Boolean,
                default: false
            },
            callback: Function,
            needCallBack: {
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
                vehicleList: []
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
            disabledValue: {
                get:function () {
                    return this.disabled;
                }
            },
            vehicleType: {
                get:function () {
                    return this.type;
                }
            }
        },
        mounted(){
            // this.queryVehicle();
        },
        methods:{
            queryVehicle(query) {
                let vm = this;
                this.vehicleList = [];
                Http.get(Api.vehicle.commonSelect, {params: {'query': query,'typeList':vm.type,'code':vm.code,'operationMode':vm.vehicleOperationType,'settlementMode':vm.settlementMode}}, result => {
                    vm.vehicleList = result.result;
                })
            },
            setCurrentVehicle(vehicle){
                let vm  = this;
                if(vehicle) {
                    vm.vehicleList = [];
                    if(Array.isArray(vehicle)) {
                        vehicle.forEach(item => {
                            vm.vehicleList.push(item);
                        });
                    } else {
                        vm.vehicleList.push(vehicle);
                    }
                }
            },
            clearVehicleList(){
                let vm  = this;
                vm.vehicleList = [];
            },
            getObject(){
                var obj;
                this.vehicleList.forEach(column => {
                    if(column.code === this.value){
                        obj = column
                    }
                });
                return obj
            },
            resetData(){
                this.currentValue = ""
            },
            handleChange(val){
                let vm  = this;
                let vehicle = null;
                vm.vehicleList.forEach(item => {
                    if(item.code===val){
                        vehicle = item;
                    }
                });
                vm.$emit('change-option',vehicle);
            }
        }
    }
</script>

<style scoped>

</style>
