<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        remote
        clearable
        :default-first-option="true"
        placeholder="请输入关键词"
        @change="handleChange"
        :remote-method="queryOilStation">
        <el-option
            v-for="item in stationList"
            :key="item.id"
            :label="item.stationName"
            :value="item.id">
            <span style="float: left" >{{ item.stationName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px" >{{ item.currentCompany == "WAN_JIN_YOU" ? "万金油":(item.currentCompany == "FA_YOU_WEBSITE" ? "找油网" : "")}}</span>
        </el-option>
    </el-select>
</template>

<script>
    import {Http} from 'src/global/http';
    import {Api} from 'src/global/api';
    export default {
        props: {
            value: String,
            oilSearchStationId: String,
            goldOilStationId: String,
            id:String
        },
        data() {
            return {
                stationList: [],
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
            queryOilStation(query) {
                let vm = this;
                vm.stationList = [];
                Http.get(Api.oilStation.oilStationCommonPage, {params: {'query':query,"id":vm.id}}, result => {
                    vm.stationList = result.result.records;
                })
            },
            setCurrentStation(station){
                if(station){
                    let vm  = this;
                    vm.stationList = [];
                    vm.stationList.push(station);
                }
            },
            handleChange(val){
                let vm  = this;
                vm.stationList.forEach(item => {
                    if(item.code==val){
                        this.$emit('update:stationName',item.name);
                        this.$emit('change',item);
                    }
                });
            },
            clearStationList() {
                this.stationList = [];
            }
        }
    }
</script>
