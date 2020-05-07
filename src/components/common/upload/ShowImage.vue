<template>
    <div>
        <image-viewer :images="imageList" :visible.sync="isImageViewerShow"></image-viewer>
        <el-button size="mini" type="text" @click="isImageViewerShow = true" v-show="showButton">查看图片</el-button>
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
                if(!this.url) {
                    return false;
                }
                return this.url.length > 0;
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
                isImageViewerShow:false
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
            }
        }

    }
</script>
