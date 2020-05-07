<template>
    <el-container>
        <el-upload :action="importUrl"
                   :headers = "{'Authorization':'Bearer ' + common.token.getToken()}"
                   :name ="file"
                   accept=".xls"
                   :on-preview="handlePreview"
                   :on-remove="handleRemove"
                   :before-upload="beforeUpload"
                   :on-error="uploadFail"
                   :on-success="uploadSuccess"
                   :show-file-list=false
                   list-type="picture">
            <el-button size="mini" type="primary" icon="el-icon-upload2">{{btnName}}</el-button>
        </el-upload>
    </el-container>
</template>

<script>
    import {Common} from 'src/global/common';

    export default {
        props: {
            file:String,
            importUrl: String,///上传的URL
            btnName: {
                type: String,
                default: '导入'
            }
        },
        data() {
            return {
                common: Common
            };
        },
        methods: {
            //可以通过 file.response 拿到服务端返回数据
            handlePreview() {
            },
            //文件移除
            handleRemove(){
            },
            //上传前配置
            beforeUpload(file){
                let excelFileExtend = ".xls,.xlsx";  //设置文件格式
                let fileExtend = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
                if (excelFileExtend.indexOf(fileExtend) <= -1) {
                    this.$message.error('文件格式错误')
                    return;
                }
            },
            //上传错误
            uploadFail(err, file, fileList) {
                this.$message.error('导入失败')
            },
            //上传成功
            uploadSuccess(response, file, fileList) {
                if(response.success){
                    this.$message.success('导入成功');
                    this.$emit('success');
                    return;
                }else{
                    if(response.businessException){
                        this.$message.error("上传失败!" +  response.message);
                    }else {
                        this.$message.error("上传失败!");
                    }
                    return;
                }
                //this.$message.info(response.message);
            }
        }
    }
</script>

