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
        :remote-method="querySupplier"
        @change="handleChange">
        <el-option
            v-for="item in supplierList"
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
            auditType:{ //审核状态 未审核 UNAUDITED 审核通过 PASS 审核不通过 NO_PASS
                type:String,
                default: '', //审核通过合审核中都需要查询到，20191031过后没有审核不通过的
                // default: 'PASS',
            },
            isExist: String, //车队是否开票
            type: String,       //CAR_TEAM 车队 DEPARTMENT_OF_INFORMATION 信息部  PLANTFORM_COMPANY 平台公司
            types: String,      // CAR_TEAM,DEPARTMENT_OF_INFORMATION,PLANTFORM_COMPANY  逗号隔开
            disabled: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: '请输入供应商名称或手机号'
            }
        },
        data() {
            return {
                supplierList: []
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
            this.querySupplier()
        },
        methods: {
            querySupplier(query) {
                let vm = this;
                vm.supplierList = [];
                Http.get(Api.supplier.commonSelect, {
                    params: {
                        'query': query,
                        'auditType': vm.auditType,
                        'isExist': vm.isExist,
                        'type': vm.type,
                        'types': vm.types
                    }
                }, result => {
                    vm.supplierList = result.result;
                })
            },
            setCurrentSupplier(supplier) {
                if (supplier) {
                    let vm = this;
                    vm.supplierList = [];
                    vm.supplierList.push(supplier);
                }
            },
            handleChange(val){
                let vm  = this;
                let supplier = null;
                vm.supplierList.forEach(item => {
                    if(item.id==val){
                        supplier = item;
                    }
                });
                this.$emit('supplier',supplier);
            },
            getObject() {
                let obj;
                let _this = this;
                _this.supplierList.forEach(column => {
                    if (column.id === _this.value) {
                        obj = column
                    }
                });
                return obj
            },
            emptyObject(){
                this.supplierList = [];
            }
        }
    }
</script>
