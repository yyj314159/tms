<template>
    <el-container>
        <el-upload
            :action="action"
            :headers = "{'Authorization':'Bearer ' + common.token.getToken()}"
            :on-change="handleChange"
            :on-preview="handlePreview"
            :file-list="fileList"
            :disabled=disabled
            :data="extraData"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
            :multiple="true"
            :limit="limit"
            list-type="picture"
            :on-exceed="warning">
            <el-button size="mini" type="primary">上传</el-button>
            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
        </el-upload>
        <image-viewer :images="imageList" :visible.sync="isImageViewerShow"></image-viewer>
    </el-container>
</template>
<script>
    import {Api, Common} from 'src/global';

    export default {
        props: {
            disabled: Boolean, //是否禁用
            fileModule: {      //文件模块，上传目录
                type: String,
                default: "tms"
            },
            limit: {
                type: Number,
                default: 100
            },
            action: { // 地址在不传的情况下，默认是行驶证的识别
                default: Api.uploadAndRecognition.vehicleLicense
            }
        },
        data() {
            return {
                fileList: [],
                extraData: {
                    module: this.fileModule
                },
                common: Common,
                isImageViewerShow:false,
                url: ''
            };
        },
        computed: {
            imageList: function () {
                if (!this.url) {
                    return [];
                }
                if (Array.isArray(this.url)) {
                    return this.url;
                } else {
                    return this.url.split(',');
                }
            }
        },
        watch: {
            fileList(val) {/*
                const _this = this;
                val.forEach(va => {
                    if(va.response.success === false){
                        _this.remove(va)
                    }
                })*/
            },
            isImageViewerShow(val){
                if(val){
                    document.addEventListener('keydown', this.escKeyDown)
                }else{
                    document.removeEventListener('keydown', this.escKeyDown)
                }
            },
            deep: true
        },
        methods: {
            handleRemove(file, fileList) {
                this.fileList = fileList;
            },
            handlePreview(file) {
                // if(file.url.substring(file.url.lastIndexOf('.')).toLowerCase() === '.jpg' || file.url.substring(file.url.lastIndexOf('.')).toLowerCase() === '.png'){
                //     this.dialogImageUrl = file.url;
                //     this.dialogVisible = true;
                // }else{
                //     // window.open(file.url)
                //     this.url = file.url;
                //     this.isImageViewerShow = true;
                // }
                this.url = file.url;
                this.isImageViewerShow = true;
            },
            handleChange(file, fileList) {
                if (fileList) {
                    for (let i = 0; i < fileList.length; i++) {
                        fileList[i].name = '查看';
                    }
                }
                this.fileList = fileList;
            },
            /**
             * 获取文件url
             * @returns {Array} url列表 eg.[{'https://fuss10.elemecdn.com/3/63/4e7f3a1ebp/quality/100'}]
             */
            getFileList() {
                let result = [];
                let fileList = this.fileList;
                console.log(fileList)
                if (fileList) {
                    for (let i = 0; i < fileList.length; i++) {
                        if (fileList[0].response.success === true) {
                            let responseInfo = fileList[i].response.result;
                            if (responseInfo) {
                                for (let j = 0; j < responseInfo.urls.length; j++) {
                                    // let fileInfo = {};
                                    //fileInfo.name = fileList[i].name;
                                    // fileInfo.url = responseInfo[j];
                                    result.push(responseInfo.urls[j]);
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
             * 设置FileList
             * @param newFileList eg.[{'https://fuss10.elemecdn.com/3/63/4e7f3a1ebp/quality/100'}]
             */
            setFileList(newFileList) {
                let vm = this;
                if (newFileList) {
                    for (let i = 0; i < newFileList.length; i++) {
                        if (newFileList[i] && newFileList[i].trim() != "") {
                            let fileInfo = {};
                            fileInfo.name = '查看';
                            fileInfo.response = {success: true};
                            fileInfo.url = newFileList[i];
                            vm.fileList.push(fileInfo);
                        }
                    }
                }
            },
            /**
             * 清空文件列表
             */
            clearFileList() {
                this.fileList = []
            },
            clearLast() {
                this.fileList = this.fileList.slice(0,this.fileList.length-1);
            },
            uploadError(err, file, fileList) {
                console.log(err);
                this.$message.error("上传失败!,系统异常");
            },
            uploadSuccess(response, file, fileList) {
                if (!response.success) {
                    if (response.businessException) {
                        this.$message.error("上传失败!" + response.message);
                    } else {
                        this.$message.error("上传失败!");
                    }
                    fileList.splice(fileList.indexOf(file), 1);
                }else{
                    this.fileList = fileList.reverse();
                }
                this.$emit('upload', response);
            },
            escKeyDown(e){
                let vm = this;
                if(e.keyCode == 27){
                    vm.isImageViewerShow = false;
                    e.stopPropagation();
                }
            },
            warning() {
                let vm = this;
                vm.$message.warning('文件个数超出限制！');
            }
        }
    }
</script>

