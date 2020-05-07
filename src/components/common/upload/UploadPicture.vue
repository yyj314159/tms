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
            list-type="picture-card"
            :on-exceed="warning">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
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
            cleanList:{ // 对传入的数据进行去重
                type:Boolean,
                default:false
            },
            maxNumber:{ // 最大数量
                type:Number,
            }
        },
        data() {
            return {
                action: Api.upload.image,
                fileList: [],
                dialogImageUrl: '',
                dialogVisible: false,
                extraData: {
                    module: this.fileModule
                },
                common: Common
            };
        },
        watch:{
            fileList:{
                handler(list){
                    let newList = [];
                    if(list.length>0){
                        list.forEach((item)=>{
                            if(item.response && item.response.result && item.response.result[0]){
                                newList.push(item.response.result[0])
                            }
                            if(item.url){
                                newList.push(item.url)
                            }
                        })
                    }
                    this.$emit('listChange',newList.join(','));
                },
                immediate: false
            }
        },
        methods: {
            checkLength(){
                if(this.maxNumber){
                    if(this.fileList.length>this.maxNumber){
                        this.$message.error('数量超出限制')
                        this.fileList = this.fileList.slice(0,this.fileList.length-1);
                    }
                }
            },
            handleRemove(file, fileList) {
                this.fileList = fileList;
            },
            handlePreview(file) {
                if(file.url.substring(file.url.lastIndexOf('.')).toLowerCase() === '.jpg' || file.url.substring(file.url.lastIndexOf('.')).toLowerCase() === '.png'){
                    this.dialogImageUrl = file.url;
                    this.dialogVisible = true;
                }else{
                    window.open(file.url)
                }
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
                if (fileList) {
                    for (let i = 0; i < fileList.length; i++) {
                        if (fileList[0].response.success === true) {
                            let responseInfo = fileList[i].response.result;
                            if (responseInfo) {
                                for (let j = 0; j < responseInfo.length; j++) {
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
                if(this.cleanList){
                    vm.fileList = _.uniqBy(vm.fileList,'url')
                }
                this.checkLength()
            },
            /**
             * 清空文件列表
             */
            clearFileList() {
                this.fileList = [];
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
                }
                this.$emit('upload', response);
                this.checkLength()
            },
            warning() {
                let vm = this;
                vm.$message.warning('文件个数超出限制！');
            }
        }
    }
</script>

