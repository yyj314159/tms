<template>
    <el-container>
        <el-form class="container" size="small" inline :model="importFileForm" ref="importFileForm"
                     label-width="80px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="部门:" prop="depart">
                        <el-select v-model="importFileForm.depart" filterable placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="上传文件:" prop="relativePath">
                        <new-upload-file ref="relativePath" @newFile="file => newFile(file)" module="bigData" category="upload" :useOriginalFilename="true" :action="action" :limit="1" @upload="(res, file, fileList) => upload(res, file, fileList)"></new-upload-file>
                    </el-form-item>
                </el-col>
                <el-col :span="24" class="btn">
                    <el-form-item label="" prop="submit">
                        <el-button class="sub" type="primary" size="small" :disabled="saveImportDetailBtn" @click="submitData(importFileForm)">提交</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-container>
</template>

<script>
    import {Http,Api,Common} from 'src/global'
    import axios from 'axios'

    export default {
        data() {
            return {
                options: [{
                    value: '1',
                    label: '财务'
                    }, {
                    value: '2',
                    label: '营运'
                    }, {
                    value: '3',
                    label: '请车'
                    }, {
                    value: '4',
                    label: '商务'
                    }],
                    common: Common,
                    saveImportDetailBtn: false,
                    importFileForm: {
                        relativePath: '',
                        depart: '财务',
                    },
                    action: Api.dataImport.uploadFile
                }
        },
        created() {
        },
        methods: {
            newFile(file) {
                console.log('newFile', file.name);
            },
            upload(res, file, fileList) {
                console.log('res', res);
                this.importFileForm.relativePath = res.result[0]
            },
            beforeUpload1(file) {
                console.log('123');
            },
            saveImportDetail(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$refs.upload1.submit();
                    }
                });
            },
            //文件超出个数限制时的钩子
            handleExceed() {
                this.$message.warning(`已经选择 1 个文件`);
            },
            importData() {
                let vm = this;
                this.fileList1 = [];
                vm.importDetailDialog = true;
            },
            submitData(formName) {
                Http.post(Api.dataImport.add, formName, res => {
                    if (res.success) {
                        this.$message({
                            message: '上传成功',
                            type: 'success'
                            });
                        this.$refs.relativePath.clearFileList()
                    } else {
                        this.$message.error('上传失败，请重新上传');
                    }
                })
            }
        }
    }
</script>

<style >
    .container {
       width: 800px;
       padding: 30px 20px 0; 
       border: 1px solid #aaa;
    }
    .btn {
        text-align: right;
    }
    .sub {
        width: 100px;
        height: 38px;
        font-size: 16px;
        margin-top: 30px;
        text-align: center;
    }
</style>
