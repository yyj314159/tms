<template>
    <div>
        <image-viewer :images="imageList" :visible.sync="isImageViewerShow"></image-viewer>
        <el-button type="text" @click="isImageViewerShow = true" v-show="showButton">
            <img :src="url.split(',')[0]"  v-if="!showAll" width="100"/>
            <div v-else>
                <img :src="item" v-for="(item,index) in imageList" :key="index" width="100" style="margin-right: 10px;"/>
            </div>
        </el-button>
    </div>
</template>

<script>
    import Vue from 'vue'
    import ImageViewer from 'vue2.0-image-viewer'
    Vue.use(ImageViewer);

    export default {
        props : {
            url : String,
            showAll:{ // 是否显示所有的图片的缩略图
                type:Boolean,
                default:false
            }
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
            escKeyDown(e){
                let vm = this;
                if(e.keyCode == 27){
                    vm.isImageViewerShow = false;
                }
            }
        }

    }
</script>
