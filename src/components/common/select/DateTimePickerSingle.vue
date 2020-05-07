<template>
    <el-date-picker
        v-model="currentValue"
        :size="size"
        :clearable="clearable"
        :editable="editable"
        type="datetime"
        style="width:100%;"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择收款时间"
        :picker-options="pickerOptions">
    </el-date-picker>
</template>

<script>

    export default {
        props: {
            dateType: {//start开始00：00：00    end结束23：59：59
                type: String,
                default: 'start'
            },
            startDate: {//dateType为end时传入--限制开始时间
                type: String,
                default: ''
            },
            endDate: {//dateType为start时传入--限制结束时间
                type: String,
                default: ''
            },
            maxRangeDays: {
                type: String,
                default: ''
            },
            size: {
                type: String,
                default: 'small'
            },
            clearable: {
                type: Boolean,
                default: true
            },
            editable: {
                type: Boolean,
                default: true
            },
            disabledFutureDate: {
                type: Boolean,
                default: true
            },
            value: String
        },
        computed:{
            currentValue: {
                get:function() {
                    return this.value;
                },
                set:function(val) {
                    if(!_.isNil(val)){
                        if(this.dateType === 'start'){
                            this.$emit('input',`${val}`);
                        }else if(this.dateType === 'end'){
                            this.$emit('input',`${val}`);
                        }else{
                            this.$emit('input','');
                        }
                    }else{
                        this.$emit('input','');
                    }
                }
            }
        },
        data() {
            return {
                pickerOptions: {
                    disabledDate: (time) => {
                        let vm = this;
                        if(vm.dateType === 'start' && vm.disabledFutureDate){
                            if(vm.endDate === ""){
                                return time.getTime() > Date.now();
                            }
                            if (vm.maxRangeDays > 0) {
                                return time.getTime() > Date.now() || time.getTime() < (new Date(vm.endDate).getTime() - vm.maxRangeDays*24*3600*1000) || time.getTime() > new Date(vm.endDate).getTime();
                            }
                            return time.getTime() > Date.now() || time.getTime() > new Date(vm.endDate).getTime();
                        }
                        if(vm.dateType === 'start' && !vm.disabledFutureDate){
                            if(vm.endDate === ""){
                                return false;
                            }
                            if (vm.maxRangeDays > 0) {
                                return time.getTime() < (new Date(vm.endDate).getTime() - vm.maxRangeDays*24*3600*1000) || time.getTime() > new Date(vm.endDate).getTime();
                            }
                            return time.getTime() > new Date(vm.endDate).getTime();
                        }
                        if(vm.dateType === 'end' && vm.disabledFutureDate){
                            if (vm.maxRangeDays > 0) {
                                return time.getTime() > (new Date(vm.startDate).getTime() + vm.maxRangeDays*24*3600*1000) || time.getTime() > Date.now() || time.getTime() < new Date(vm.startDate).getTime();
                            }
                            return time.getTime() < new Date(vm.startDate).getTime() || time.getTime() > Date.now();
                        }
                        if(vm.dateType === 'end' && !vm.disabledFutureDate){
                            if(vm.startDate === ""){
                                return false;
                            }
                            if (vm.maxRangeDays > 0) {
                                return time.getTime() > (new Date(vm.startDate).getTime() + vm.maxRangeDays*24*3600*1000) || time.getTime() < new Date(vm.startDate).getTime();
                            }
                            return time.getTime() < new Date(vm.startDate).getTime();
                        }
                    }
                }
            }
        }
    }
</script>
