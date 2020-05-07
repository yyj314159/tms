<template>
    <div class="exportButton">
        <el-button v-if="exportLoading" icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
        <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
    </div>
</template>

<script>
    import {Http} from 'src/global/http'
    import axios from 'axios'
    export default {
        props: {
            href: String,
            params: {
                type: Object,
                default: {}
            },
            downloadName: String
        },
        data() {
            return {
                exportLoading: true,
            }
        },
        methods:{
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(vm.href, {params: vm.params, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = vm.downloadName + '.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>

<style scoped>

</style>
