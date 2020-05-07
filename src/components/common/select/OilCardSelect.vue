<template>
    <el-select
        v-model="currentValue"
        size="small"
        filterable
        :remote="remote"
        :disabled="disabled"
        :default-first-option="true"
        clearable
        automatic-dropdown
        placeholder="请输入油卡卡号"
        @change="change"
        :remote-method="queryOilCard">
        <el-option
            v-for="item in oilCardList"
            :key="item.cardNo"
            :label="item.cardNo"
            :value="item.cardNo">
            <span style="float: left">{{ item.cardNo }}</span>
            <span style="float: right"> <dictionary-select-name option-name="OIL_CANCELLATION" :value="item.oilCardType"/></span>
        </el-option>
    </el-select>
</template>

<script>
    import {Http,Api} from 'src/global/index';

    export default {
        props: {
            value: String,
            remote: {
                type: Boolean,
                default: true
            },
            supplierCode: String,
            currentUser: String,
            disabled: {
                type: Boolean,
                default: false
            },
            defaultList: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                oilCardList: [],
                oilCardLists: []
            }
        },
        watch: {
            defaultList: function () {
                this.oilCardList = this.defaultList;
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
            },
            supplier: {
                get: function () {
                    return this.supplierCode; // 将props中的value赋值给supplier
                },
            },
            userName: {
                get: function () {
                    return this.currentUser; // 将props中的value赋值给name
                },
            }
        },
        methods: {
            queryOilCard(query) {
                let vm = this;
                vm.oilCardList = [];
                Http.get(Api.oilCard.commonSelect, {
                    params: {
                        'query': query,
                        'supplierCode': vm.supplier,
                        'userName': vm.userName
                    }
                }, result => {
                    vm.oilCardList = result.result;
                    vm.oilCardLists = _.cloneDeep(vm.oilCardList);
                })
            },
            setCurrentOilCard(oilCard) {
                if (oilCard) {
                    let vm = this;
                    vm.oilCardList = [];
                    vm.oilCardList.push(oilCard);
                }
            },
            change: function (val) {
                let vm = this;
                let oilCard = null;
                vm.oilCardList.forEach(item => {
                    if (item.cardNo == val) {
                        oilCard = item;
                    }
                });
                this.$emit('change', oilCard);
            },
            /*visibleChange: function(visible){
                if(!visible){
                    this.change(this.value);
                }
            },*/
            getObject() {
                let obj;
                let _this = this;
                _this.oilCardLists.forEach(column => {
                    if (column.cardNo === _this.value) {
                        obj = column
                    }
                });
                return obj
            },
        }
    }
</script>

