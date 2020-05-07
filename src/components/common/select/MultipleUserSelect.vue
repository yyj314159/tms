<template>
    <el-select
        v-model="currentValue"
        size="small"
        multiple
        :multiple-limit="3"
        filterable
        remote
        clearable
        :disabled="disabled"
        placeholder="请选择业务员"
        :remote-method="queryUser"
    style="display: block; width: 100%;">
        <el-option
            v-for="item in userList"
            :key="item.jointName"
            :label="item.name"
            :value="item.jointName">
            <span style="float: left" >{{ item.jointName }}</span>
            <!--<span style="float: right; color: #8492a6; font-size: 13px" >{{ item.username }}</span>-->
        </el-option>
    </el-select>
</template>

<script>
    import {Http,Api} from 'src/global/index';
    export default {
        props: {
            value:Array,
            disabled:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                userList: []
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
        mounted() {
            this.queryUser()
        },
        methods:{
            queryUser(query) {
                this.userList = [];
                Http.get(Api.user.commonSelect, {params: {'query': query}}, result => {
                    this.userList = result.result;
                })
            },
            setCurrentUserList(userList){
                if(userList && Array.isArray(userList)){
                    if(Array.isArray(userList)){
                        this.userList = userList;
                    }else{
                        this.userList.push(userList)
                    }
                }
            }
        }
    }
</script>
<style scoped>
    .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{
        display: none;
    }
    el-select-dropdown.is-multiple .el-select-dropdown__item.selected span{
        color: #409EFF !important;
    }
</style>
