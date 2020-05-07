<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";     /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
    
    /* 覆盖图片预览组件的默认样式 */
    #app .closeButton{
        border: 50px solid rgba(225, 225 ,225, .75);
    }
    #app .closeButton em{
        height: 40px;
        transform: rotate(-45deg) translate(20px, 0px)
    }
    #app .closeButton em::after{
        height: 40px;
    }
</style>