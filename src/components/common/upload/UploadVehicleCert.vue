<template>
    <el-container>
        <el-upload
            :action="action"
            :headers = "{'Authorization':'Bearer ' + common.token.getToken()}"
            :disabled=disabled
            :data="extraData"
            :before-upload="beforeAvatarUpload"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :multiple="true"
            :show-file-list = "false"
            :limit="limit"
            accept=".zip"
            :on-exceed="warning">
            <el-button size="mini" type="primary">{{ title }}</el-button>
        </el-upload>
    </el-container>
</template>
<script>
    import {Api, Common} from 'src/global/index';

    export default {
        props: {
            title: {
                type: String,
                default: '上传'
            },
            disabled: Boolean, //是否禁用
            fileModule: {      //文件模块，上传目录
                type: String,
                default: "vehicle"
            },
            limit: {
                type: Number,
                default: 100
            }
        },
        data() {
            return {
                action: Api.vehicle.certBatchUpload,
                fileList: [],
                extraData: {
                    module: this.fileModule
                },
                common: Common
            };
        },
        methods: {
            beforeAvatarUpload(file){
                const isLt30M = file.size / 1024 / 1024 < 30;
                var FileSuffix=file.name.substring(file.name.lastIndexOf('.')+1)
                if (!isLt30M) {
                    this.$message.error('上传图片的大小不能超过 30M!');
                    return false;
                }
                if (!FileSuffix || FileSuffix.toLowerCase() != "zip") {
                    this.$message.error("请上传zip格式的文件");
                    return false;
                }
            },
            uploadError(err, file, ) {
                this.$message.error("上传失败!,系统异常");
            },
            uploadSuccess(response, file,) {
                if (!response.success) {
                    if (response.businessException) {
                        this.$message.error("上传失败!" + response.message);
                    } else {
                        this.$message.error("上传失败!");
                    }
                }
                if (response.result.length > 0) {
                    this.$message.warning("上传成功;有异常证件,请检查后重新上传;图片名:" + response.result);
                } else {
                    this.$message.success("上传成功");
                }
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


