<template>
    <div>
        <image-viewer :images="imageList" :visible.sync="isImageViewerShow"></image-viewer>
        <span v-show="show">
            <el-button size="mini" type="text" @click="isImageViewerShow = true" v-if="showButton">查看图片</el-button>
            <el-button size="mini" type="text" @click="download" v-else="showButton">下载文件</el-button>
        </span>
    </div>
</template>

<script>
    import Vue from 'vue'
    import ImageViewer from 'vue2.0-image-viewer'
    Vue.use(ImageViewer);

    export default {
        props : {
            url : String
        },
        computed:{
            imageList:function(){
                if(!this.url) {
                    return [];
                }
                if(Array.isArray(this.url)){
                    return this.url;
                }else{
                    return this.url.split(',');
                }
            },
            showButton:function(){
                //如果没有就不显示
                if(!this.url){
                    this.show=false;
                    return;
                }
                //如果是图片，就查看
                if(this.url.substring(this.url.lastIndexOf('.')).toLowerCase() === '.jpg' || this.url.substring(this.url.lastIndexOf('.')).toLowerCase() === '.png'){
                    this.show=true;
                    return true;
                //如果是文件，就下载
                }else{
                    this.show=true;
                    return false;
                }
            }
        },
        watch:{
            isImageViewerShow(val){
                if(val){
                    document.addEventListener('keydown', this.escKeyDown)
                }else{
                    document.removeEventListener('keydown', this.escKeyDown)
                }
            }
        },
        data(){
            return {
                isImageViewerShow:false,
                show:false
            }
        },
        methods:{
            closeViewer(){
                this.isImageViewerShow = false;
            },
            escKeyDown(e){
                let vm = this;
                if(e.keyCode == 27){
                    vm.isImageViewerShow = false;
                    e.stopPropagation();
                }
            },
            //下载文件
            download(){
                window.open(this.url);
            }
        }

    }
</script>
