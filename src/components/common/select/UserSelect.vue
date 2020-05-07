<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        remote
        clearable
        :disabled="disabled"
        placeholder="请输入关键词"
        :remote-method="queryUser">
        <el-option
            v-for="item in userList"
            :key="item.username"
            :label="item.name"
            :value="item.username">
            <span style="float: left" >{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px" >{{ item.username }}</span>
        </el-option>
    </el-select>
</template>

<script>
    import {Http,Api} from 'src/global/index';
    export default {
        props: {
            value:String,
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
                let vm = this;
                vm.userList = [];
                Http.get(Api.user.commonSelect, {params: {'query': query}}, result => {
                    vm.userList = result.result;
                })
            },
            setCurrentUser(user){
                if(user){
                    let vm  = this;
                    vm.userList = [];
                    vm.userList.push(user);
                }
            }
        }
    }
</script>
