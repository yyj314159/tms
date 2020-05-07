<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        remote
        :disabled="disabled"
        reserve-keyword
        :default-first-option="true"
        clearable
        placeholder="请输入GPS号码"
        @change="onChange"
        :remote-method="queryGps">
        <el-option
            v-for="item in gpsList"
            :key="item.code"
            :label="item.code"
            :value="item.code">
            <span style="float: left">{{ item.code }}</span>
            <span style="float: right"><dictionary-select-name option-name="GPS_STATUS" :value="item.status "/></span>
        </el-option>
    </el-select>
</template>

<script>
    import {Http, Api} from 'src/global';

    export default {
        props: {
            value: String,
            status: String,
            belongOrgCode: String,
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                gpsList: []
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
        methods: {
            queryGps(query) {
                let vm = this;
                this.gpsList = [];
                Http.get(Api.gps.commonSelect, {
                    params: {
                        'query': query,
                        'status': vm.status,
                        'belongOrgCode': vm.belongOrgCode
                    }
                }, result => {
                    vm.gpsList = result.result;
                })
            },
            setCurrentGps(gps) {
                if (gps) {
                    let vm = this;
                    vm.gpsList = [];
                    vm.gpsList.push(gps);
                }
            },
            onChange: function (val) {
                let vm = this;
                if (val) {
                    vm.gpsList.forEach(item => {
                        if (item.code == val) {
                            this.$emit('gpsObj', item);
                        }
                    });
                }
            }
        }
    }
</script>

