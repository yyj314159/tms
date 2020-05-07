<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        remote
        :default-first-option="true"
        clearable
        :disabled="disabled"
        :placeholder="placeholder"
        :remote-method="queryIncomeSubject"
        @change="handleChange">
        <el-option
            v-for="item in incomeSubjectList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.contact }}</span>
        </el-option>
    </el-select>
</template>

<script>
    import {Http, Api} from 'src/global';

    export default {
        props: {
            value: String,
            disabled: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: '请输入收入主体名称'
            }
        },
        data() {
            return {
                incomeSubjectList: []
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
            }
        },
        mounted() {
            this.queryIncomeSubject()
        },
        methods: {
            queryIncomeSubject(query) {
                let vm = this;
                vm.incomeSubjectList = [];
                Http.get(Api.incomeSubject.commonSelect, {
                    params: {
                        'query': query,
                    }
                }, result => {
                    vm.incomeSubjectList = result.result;
                })
            },
            setCurrentIncomeSubject(incomeSubject) {
                if (incomeSubject) {
                    let vm = this;
                    vm.incomeSubjectList = [];
                    vm.incomeSubjectList.push(incomeSubject);
                }
            },
            handleChange(val){
                let vm  = this;
                let incomeSubject = null;
                vm.incomeSubjectList.forEach(item => {
                    if(item.id==val){
                        incomeSubject = item;
                    }
                });
                this.$emit('incomeSubject',incomeSubject);
            },
            getObject() {
                let obj;
                let _this = this;
                _this.incomeSubjectList.forEach(column => {
                    if (column.id === _this.value) {
                        obj = column
                    }
                });
                return obj
            },
            emptyObject(){
                this.incomeSubjectList = [];
            }
        }
    }
</script>
