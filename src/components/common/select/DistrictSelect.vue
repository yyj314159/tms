<template>
    <el-cascader
        size="small"
        placeholder="请输入关键词"
        :options="levelDistrict"
        :clearable=true
        v-model="currentValue"
        @change="handleChange"
        filterable
        :disabled="isDisabled"        
    ></el-cascader>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        props: {
            value: {},
            callback: Function,
            needCallBack: {
                type: Boolean,
                default: false
            },
            level: {//默认显示层级2级，显示到城市，传入3可显示到区域
                type: Number,
                default: 2
            },
            isDisabled:{
                default:false
            }
        },
        computed: {
            ...mapGetters([
                'district'
            ]),
            currentValue: {
                // 动态计算currentValue的值
                get:function() {
                    if(!this.value) {
                        return [];
                    }
                    if(Array.isArray(this.value)) {
                        return this.value;
                    } else {
                        return this.value.split(",");
                    }
                },
                set:function(val) {
                    this.$emit('input', val); // 通过$emit触发父组件
                }
            },
            //显示二级还是三级
            levelDistrict(){
                let vm = this, arr = vm.district;
                if(vm.level === 1){
                    arr = arr.map(function(item,index){
                        return item = {
                            value: item.value,
                            label: item.label
                        }
                    })
                }else if(vm.level === 3){
                    arr = vm.district;
                }else{
                    arr = arr.map(function(item,index){
                        return item = {
                            value: item.value,
                            label: item.label,
                            children: item.children.map(function(val,index){
                                return val = {
                                    value: val.value,
                                    label: val.label
                                }
                            })
                        }
                    })
                }
                return arr;
            }
        },
        data() {
            return {
                districtList: []
            }
        },
        methods: {
            handleChange(val) {
                let vm= this;
                if(vm.needCallBack) {
                    let prov = '';
                    let city = '';
                    let area = '';
                    if(val && val.length == 3) {
                        vm.levelDistrict.forEach(item => {
                            vm.traverseTree(item);
                        });
                        vm.districtList.forEach(item => {
                            if(item.value == val[0]) {
                                prov = item.label;
                            }
                            if(item.value == val[1]) {
                                city = item.label;
                            }
                            if (item.value == val[val.length - 1]) {
                                area = item.label;
                            }
                        });
                        vm.callback(prov + city + area,area,prov,city); // 将参数传回父组件中的回调函数
                    }else {
                        vm.$emit('clear')
                    }
                }
            },
            traverseNode(node) {
                let district = {};
                district.value = node.value;
                district.label = node.label;
                this.districtList.push(district);
            },
            traverseTree(node) {
                if (!node) {
                    return;
                }
                this.traverseNode(node);
                if (node.children && node.children.length > 0) {
                    var i = 0;
                    for (i = 0; i < node.children.length; i++) {
                        this.traverseTree(node.children[i]);
                    }
                }
            }
        }
    }
</script>

