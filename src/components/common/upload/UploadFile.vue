<template>
    <el-container>
        <el-upload
            :on-remove="handleRemove"
            :action="action"
            :headers = "{'Authorization':'Bearer ' + common.token.getToken()}"
            :file-list="fileList"
            :disabled=disabled
            :data="extraData"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :multiple="true"
            :limit="limit"
            :on-exceed="warning">
            <el-button size="mini" type="primary">{{ title }}</el-button>
        </el-upload>
    </el-container>
</template>
<script>
    import {Api, Common} from 'src/global';

    export default {
        props: {
            title: {
                type: String,
                default: '上传'
            },
            disabled: Boolean, //是否禁用
            fileModule: {      //文件模块，上传目录
                type: String,
                default: "tms"
            },
            limit: {
                type: Number,
                default: 100
            },
            action:{
                type: String,
                default: Api.upload.file
            }
        },
        data() {
            return {
                //action: Api.upload.file,
                fileList: [],
                extraData: {
                    module: this.fileModule
                },
                common: Common
            };
        },
        methods: {
            /**
             * 获取文件url
             * @returns {Array} url列表 eg.[{'https://fuss10.elemecdn.com/3/63/4e7f3a1ebp/quality/100'}]
             */
            getFileList() {
                let result = [];
                let fileList = this.fileList;
                if (fileList) {
                    for (let i = 0; i < fileList.length; i++) {
                        if (fileList[0].response.success === true) {
                            let responseInfo = fileList[i].response.result;
                            if (responseInfo) {
                                for (let j = 0; j < responseInfo.length; j++) {
                                    // let fileInfo = {};
                                    //fileInfo.name = fileList[i].name;
                                    // fileInfo.url = responseInfo[j];
                                    result.push(responseInfo[j]);
                                }
                            } else {
                                result.push(fileList[i].url);
                            }
                        }
                    }
                }
                return result;
            },
            /**
             * 清空文件列表
             */
            clearFileList() {
                this.fileList = [];
            },
            handleRemove(file, fileList) {
                this.fileList = fileList;
            },
            uploadError(err, file, fileList) {
                this.$message.error("上传失败!,系统异常");
            },
            uploadSuccess(response, file, fileList) {
                if (!response.success) {
                    if (response.businessException) {
                        this.$message.error("上传失败!" + response.message);
                    } else {
                        this.$message.error("上传失败!");
                    }
                }
                this.$emit('upload', response);
            },
            warning() {
                let vm = this;
                vm.$message.warning('文件个数超出限制！');
            }
        }
    }
</script>
<style>
    .el-upload.el-upload--text {
        width: auto !important;
        height: auto !important;
        border: none;
    }
</style>


