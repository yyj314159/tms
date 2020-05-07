<template>
    <div class="wrapper">
        <v-head @open="closed = true" @close="closed = false"></v-head>
        <v-sidebar :collapse="closed"></v-sidebar>
        <div class="content" :style="{'left': contentWidth+'px'}">
            <tags-view style="margin-bottom: 10px;"></tags-view>
            <transition name="move" mode="out-in">
                <keep-alive>
                    <router-view :key="key" v-if="exclude"></router-view>
                </keep-alive>
            </transition>
            <transition name="move" mode="out-in">
                <router-view :key="key" v-if="!exclude"></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import TagsView from './TagsView.vue';
    export default {
        data(){
           return {
               closed: false
           }
        },
        components:{
            vHead, vSidebar, TagsView
        },
        computed:{
            contentWidth(){
                return this.closed?40:150
            },
            cachedViews() {
                return this.$store.state.tagsView.cachedViews;
            },
            key() {
                return this.$route.fullPath;
            },
            exclude() {
                return this.$route.meta.keepAlive;
            }
        }
    }
</script>
