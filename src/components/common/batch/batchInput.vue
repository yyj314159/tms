<template>
    <div class="batchInput">
        <el-input type="text" placeholder="批量输入显示/隐藏文本域..." v-model="currentValue" :clearable="true">
            <template slot="append">
                <el-popover placement="bottom" trigger="click">
                    <div style="width: 500px;">
                        <el-input type="textarea" placeholder="清空输入框会同时清空文本域..."
                                  :autosize="{ minRows: 12, maxRows: 24}" resize="none" v-model.trim="currentValue"></el-input>
                    </div>
                    <el-button slot="reference">批量输入</el-button>
                </el-popover>
            </template>
        </el-input>
    </div>
</template>

<script>
    export default {
        props: {
            value:String
        },
        computed:{
            currentValue: {
                get:function() {
                    return this.value;
                },
                set:function(val) {
                    this.$emit('input',this.setCurrentValue(val))
                }
            }
        },
        watch: {
            'value'(val) {
                this.$emit('input',this.setCurrentValue(val))
            }
        },
        methods:{
            setCurrentValue(value) {
                value = (value.replace(/^\s+|\s+$/g, ',')).replace(/[\r\n]/g, ',');
                if (value.split(",").length > 1000) {
                    value = '';
                    return this.$message.warning("查询数不能超过1000！");
                }
                return value;
            }
        }
    }
</script>

<style scoped>

</style>
