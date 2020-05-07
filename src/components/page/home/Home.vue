<template>
    <el-card class="homeContainer">
        <el-row :gutter="20" style="margin-bottom:20px;">
            <el-col :span="24">
                <el-carousel :interval="4000" height="300px">
                    <el-carousel-item v-for="item in images" :key="item.src" style="background-size: cover;"
                                      :style="{'background-image': `url(${item.src})`}">
                        <!--<img :src="item.src"/>-->
                    </el-carousel-item>
                </el-carousel>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span class="title">公司新闻</span>
                    </div>
                    <ul class="news">
                        <li><a href="https://mp.weixin.qq.com/s/-q5D34FFpi6zCCSziZHLgw">【喜报】则一在“2019年（第五届）全国货运物流行业年会”上揽获多项荣誉！<span
                            class="news-time">2019-12-10</span></a></li>
                        <li><a href="https://mp.weixin.qq.com/s/GFr64qwhv340w-hvdlXNEg"> 2019双十一，客户的认可是对则一最大的鼓励<span
                            class="news-time">2019-12-02</span></a></li>
                        <li><a href="http://www.zeyisupplychain.com/newsinfo/1919175.html"> 致则一同仁：用心守护，让爱传播<span
                            class="news-time">2019-11-26</span></a></li>
                        <li><a href="http://www.zeyisupplychain.com/newsinfo/1885213.html"> 李保荣：平凡造就伟大！- 2019双十一致全体同仁书<span
                            class="news-time">2019-11-18</span></a></li>
                        <li><a href="http://www.zeyisupplychain.com/newsinfo/1885104.html"> 2019双十一战报<span
                            class="news-time">2019-11-18</span></a></li>
                        <li><a href="http://www.zeyisupplychain.com/newsinfo/1839430.html"> 青春无悔. 不负年华不负卿-2020校招季<span
                            class="news-time">2019-11-06</span></a></li>
                        <li><a href="http://www.zeyisupplychain.com/newsinfo/1063287.html">&nbsp;<span
                            class="news-time">&nbsp;</span></a></li>
                    </ul>
                    <div class="more">
                        <a href="http://www.zeyisupplychain.com/xwzx" style="color:#409EFF;">更多&gt;&gt;</a>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span class="title">待处理任务</span>
                    </div>
                    <div style="min-height:300px;">
                        <a style="color:#ddd;">暂无</a>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
    export default {

        data: function () {
            return {
                images: [
                    {src: require("../../../assets/banner1.png")},
                    {src: require("../../../assets/banner2.png")},
                    {src: require("../../../assets/banner3.png")},
                ]
            }
        },
        mounted() {

        },
        methods: {}
    }
</script>

<style>
    .ms-doc {
        width: 100%;
        max-width: 980px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }

    .ms-doc h3 {
        padding: 9px 10px 10px;
        margin: 0;
        font-size: 14px;
        line-height: 17px;
        background-color: #f5f5f5;
        border: 1px solid #d8d8d8;
        border-bottom: 0;
        border-radius: 3px 3px 0 0;
    }

    .ms-doc article {
        padding: 45px;
        word-wrap: break-word;
        background-color: #fff;
        border: 1px solid #ddd;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
    }

    .ms-doc article h1 {
        font-size: 32px;
        padding-bottom: 10px;
        margin-bottom: 15px;
        border-bottom: 1px solid #ddd;
    }

    .ms-doc article h2 {
        margin: 24px 0 16px;
        font-weight: 600;
        line-height: 1.25;
        padding-bottom: 7px;
        font-size: 24px;
        border-bottom: 1px solid #eee;
    }

    .ms-doc article p {
        margin-bottom: 15px;
        line-height: 1.5;
    }

    .ms-doc article .el-checkbox {
        margin-bottom: 5px;
    }

    .homeContainer {

    }

    .homeContainer .more {
        width: 100%;
        text-align: right;
        line-height: 35px;
    }

    .homeContainer .more > span {
        cursor: pointer;
        color: #58B7FF;
    }

    .homeContainer .title {
        line-height: 24px;
        color: #409EFF;
        font-weight: bold;
    }

    .homeContainer .count {
        float: right;
        padding: 3px 6px;
        background-color: #58B7FF;
        border-radius: 5px;
        color: white;
    }

    .homeContainer .news {
        list-style: none;
    }

    .homeContainer .news li {
        margin-bottom: 20px;
        padding-left: 50px;
    }

    .homeContainer .news li a {
        color: #409EFF;
        font-size: 13px;
    }

    .homeContainer .news-time {
        font-size: 12px;
        color: #999;
        float: right;
        padding-right: 100px;
    }

    .homeContainer > .el-card__body {
        padding: 0;
    }
</style>
